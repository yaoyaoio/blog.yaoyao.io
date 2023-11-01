---
title: "MySQL 双主基于 GTID 复制方案"
date: "2021-09-01"
author: 耀耀
layout: post
useHeaderImage: true # 是否在博客中显示封面图（可选，默认：false）
headerImage: /img/in-post/default.jpeg # 博客封面图（必须，即使上一项选了 false，因为图片也需要在首页显示）
headerMask: rgba(40,57,101, .4)  # 封面图遮罩（可选）
headerImageCredit: Ismail Inceoglu # 图片来源，比如图片作者的名字（可选，只在 "useHeaderImage: true" 时有效）
headerImageCreditLink: https://www.artstation.com/artwork/18D5XG  # 图片来源的链接（可选，只在 "useHeaderImage: true" 时有效）
catalog: true # 是否启用右侧目录，会覆写 `themeConfig.catalog`（可选，默认：false）
hide: false # 是否在首页和标签页博客列表中隐藏这篇博客（可选，默认：false）
tags:
- "数据库"
---

---

## 背景

在生产环境中，我们需要保证数据库的高可用，一般的做法是搭建主从复制，但是主从复制存在一些问题，比如主从延迟，主从切换等，
所以我们需要搭建双主复制，双主复制可以保证数据库的高可用，同时也可以保证数据库的读写分离。
**（以上由 Github Copilot 生成）**

## 我的环境

  操作系统：`CentOS Linux release 7.8.2003 (Core)`

## 主机信息

节点 1: <`master-1`, `192.168.200.50`>

节点 2: <`master-2`, `192.168.200.51`>

## 基本操作

所有节点都需要执行以下操作

```bash
# 关闭防火墙
systemctl stop firewalld
# 关闭Selinux
vim /etc/sysconfig/selinux
SELINUX=disabled 
# 临时关闭Selinux
setenforce 0
```

## 二进制安装数据库

所有节点都需要执行以下操作

### 安装数据库

```bash
# 安装数据库
mkdir /usr/local/mysql
# 解压缩
tar -zxvf mysql-5.7.35-linux-glibc2.12-x86_64.tar.gz -C /usr/local/mysql --strip=1
# 创建用户及用户组
groupadd mysql
useradd mysql -g mysql -s /sbin/nologin
# 创建数据库数据目录
mkdir /usr/local/mysql/data
# 授权
chown -R mysql.mysql /usr/local/mysql
# 复制启动脚本
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
# 设置开机启动
chkconfig on mysqld
```

### 初始化数据库

```bash
# 初始化数据库 此处会生成默认root密码
/usr/local/mysql/bin/mysqld --user=mysql --basedir=/usr/local/mysql/ --datadir=/usr/local/mysql/data --initialize
# 会打印一下日志 记住保存好密码
2021-09-01T11:54:32.248336Z 0 [Warning] TIMESTAMP with implicit DEFAULT value is deprecated. Please use --explicit_defaults_for_timestamp server option (see documentation for more details).
2021-09-01T11:54:33.099720Z 0 [Warning] InnoDB: New log files created, LSN=45790
2021-09-01T11:54:33.236031Z 0 [Warning] InnoDB: Creating foreign key constraint system tables.
2021-09-01T11:54:33.310273Z 0 [Warning] No existing UUID has been found, so we assume that this is the first time that this server has been started. Generating a new UUID: 5f55799d-0b1b-11ec-9475-005056a53fc6.
2021-09-01T11:54:33.313554Z 0 [Warning] Gtid table is not ready to be used. Table 'mysql.gtid_executed' cannot be opened.
2021-09-01T11:54:34.641583Z 0 [Warning] A deprecated TLS version TLSv1 is enabled. Please use TLSv1.2 or higher.
2021-09-01T11:54:34.641629Z 0 [Warning] A deprecated TLS version TLSv1.1 is enabled. Please use TLSv1.2 or higher.
2021-09-01T11:54:34.642431Z 0 [Warning] CA certificate ca.pem is self signed.
2021-09-01T11:54:34.944690Z 1 [Note] A temporary password is generated for root@localhost: **urG/hV3t0jo?**
```

## 双主配置

### 节点 1 配置数据库

#### 修改配置文件

```bash
# 打开/etc/my.cnf 将以下内容添加进去
vim /etc/my.cnf

[mysqld]
# 数据目录
datadir=/usr/local/mysql/data
basedir=/usr/local/mysql/
socket=/usr/local/mysql/data/mysql.sock
user=mysql
# 端口
port=13306
character-set-server=utf8
default_storage_engine = InnoDB
lower_case_table_names = 1
# 服务ID 唯一 不同节点分配不同ID
server_id = 1
# 打开Mysql日志 格式为二进制
log-bin = mysql-bin
# 开启基于GTID的复制
gtid_mode = on
enforce_gtid_consistency = on
binlog_format = row
log-slave-updates = 1
skip_slave_start = 1
# 与节点数相同
auto-increment-increment = 2
# 自增
auto-increment-offset = 1
symbolic-links=0
[client]
port = 13306
default-character-set=utf8
socket=/usr/local/mysql/data/mysql.sock
[mysqld_safe]
log-error=/usr/local/mysql/data/error.log
pid-file=/usr/local/mysql/data/database.pid
```

#### 启动数据库

```bash
# 启动数据库
/etc/init.d/mysqld start
```

#### 初始化密码

```sql
# 登陆数据库
/usr/local/mysql/bin/mysql -uroot -p --port=13306
# 修改root密码
mysql>ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
mysql>flush privileges;
mysql>exit;
```

#### 创建从库同步用户

```sql
# 登陆数据库
/usr/local/mysql/bin/mysql -uroot -p --port=13306
# 创建同步用户
mysql>GRANT REPLICATION SLAVE ON *.* TO master1@'%' IDENTIFIED BY '123456';
mysql>flush privileges;
mysql>exit;
```

### 节点 2 配置数据库

#### 修改配置文件

```bash
# 打开/etc/my.cnf 将以下内容添加进去
vim /etc/my.cnf

[mysqld]
# 数据目录
datadir=/usr/local/mysql/data
basedir=/usr/local/mysql/
socket=/usr/local/mysql/data/mysql.sock
user=mysql
# 端口
port=13306
character-set-server=utf8
default_storage_engine = InnoDB
lower_case_table_names = 1
# 服务ID 唯一 不同节点分配不同ID
server_id = 2
# 打开Mysql日志 格式为二进制
log-bin = mysql-bin
# 开启基于GTID的复制
gtid_mode = on
enforce_gtid_consistency = on
binlog_format = row
log-slave-updates = 1
skip_slave_start = 1
# 与节点数相同
auto-increment-increment = 2
# 自增
auto-increment-offset = 2
symbolic-links=0
[client]
port = 13306
default-character-set=utf8
socket=/usr/local/mysql/data/mysql.sock
[mysqld_safe]
log-error=/usr/local/mysql/data/error.log
pid-file=/usr/local/mysql/data/database.pid
```

#### 启动数据库

```bash
# 启动数据库
/etc/init.d/mysqld start
```

#### 初始化密码

```sql
# 登陆数据库
/usr/local/mysql/bin/mysql -uroot -p --port=13306
# 修改root密码
mysql>ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
mysql>flush privileges;
mysql>exit;
```

#### 创建从库同步用户

```sql
# 登陆数据库
/usr/local/mysql/bin/mysql -uroot -p --port=13306
# 创建同步用户
mysql>GRANT REPLICATION SLAVE ON *.* TO master2@'%' IDENTIFIED BY '123456';
mysql>flush privileges;
mysql>exit;
```

## 双主同步配置

### 节点 2 开启同步节点 1

```sql
# 登陆数据库
/usr/local/mysql/bin/mysql -uroot -p --port=13306
# 创建同步
mysql>change master to master_host='192.168.200.50',master_user='master1',master_password='123456',master_port=13306,master_auto_position=1;
# 开始同步
mysql>start slave;
# 查看同步状态
mysql>show slave status\G;
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.200.50
                  Master_User: master1
                  Master_Port: 13306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000003
          Read_Master_Log_Pos: 194
               Relay_Log_File: work-02-relay-bin.000003
                Relay_Log_Pos: 367
        Relay_Master_Log_File: mysql-bin.000003
             Slave_IO_Running: Yes // 必须为Yes 表示当前线程会连接Master节点的Bin-Log 并同步到本地中继日志中
            Slave_SQL_Running: Yes // 必须为Yes 表示从本地中继日志中读取数据 恢复到对应位置
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 194
              Relay_Log_Space: 670
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 9e07b87e-0b1e-11ec-8609-005056a53fc6
             Master_Info_File: /usr/local/mysql/data/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set:
            Executed_Gtid_Set:
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_Name:
           Master_TLS_Version:
1 row in set (0.00 sec)
```

### 节点 1 开启同步节点 2

```sql
# 登陆数据库
/usr/local/mysql/bin/mysql -uroot -p --port=13306
# 创建同步
mysql>change master to master_host='192.168.200.51',master_user='master2',master_password='123456',master_port=13306,master_auto_position=1;
# 开始同步
mysql>start slave;
# 查看同步状态
mysql>show slave status\G;
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 192.168.200.51
                  Master_User: master2
                  Master_Port: 13306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000001
          Read_Master_Log_Pos: 759
               Relay_Log_File: work-01-relay-bin.000002
                Relay_Log_Pos: 862
        Relay_Master_Log_File: mysql-bin.000001
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 759
              Relay_Log_Space: 1071
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 2
                  Master_UUID: e9ff5da2-0b1e-11ec-b665-005056a5c44c
             Master_Info_File: /usr/local/mysql/data/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set: e9ff5da2-0b1e-11ec-b665-005056a5c44c:1-2
            Executed_Gtid_Set: 9e07b87e-0b1e-11ec-8609-005056a53fc6:1-5,
e9ff5da2-0b1e-11ec-b665-005056a5c44c:1-2
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_Name:
           Master_TLS_Version:
1 row in set (0.00 sec)
```

### 对 IP 进行授权访问

```sql
# 在任意一个节点上执行
# 登陆数据库
/usr/local/mysql/bin/mysql -uroot -p --port=13306
mysql>grant all on *.* to 'root'@'192.168.200.50' identified by '123456' with grant option;
mysql>grant all on *.* to 'root'@'192.168.200.51' identified by '123456' with grant option;
mysql>flush privileges;
mysql>exit;
```

## 测试数据库

任意一台服务器 2 个节点其中 1 个 需要确保已经授予 IP 访问权限

```bash
# 登陆数据库 如果登陆成功 代表数据库集群正常运行
/usr/local/mysql/bin/mysql -uroot -p -h 192.168.200.50 --port=13306
```

### 完整数据库测试

```sql
# 测试数据库创建
create database test1;
# 测试数据表创建
use test1;
create table user(
id int auto_increment primary key,
user varchar(20) not null,
sex varchar(20) not null,
birthday datetime
)
# 测试数据插入 不带ID 让Mysql自增
insert into user(user,sex,birthday) values('耀耀','男','1977-09-01');
# 查看数据
select * from user;
+----+--------+-----+---------------------+
| id | user   | sex | birthday            |
+----+--------+-----+---------------------+
|  2 | 张三 | 男 | 1977-09-01 00:00:00 |
|  4 | 张三 | 男 | 1977-09-01 00:00:00 |
|  6 | 张三 | 男 | 1977-09-01 00:00:00 |
+----+--------+-----+---------------------+
# 发现是2倍数递增
# 测试数据插入 携带ID
insert into user(id,user,sex,birthday) values(7,'耀耀','男','1977-09-01');
```

## 参考资料

- [https://keithlan.github.io/2016/06/23/gtid/](https://keithlan.github.io/2016/06/23/gtid/)
- [http://mysql.taobao.org/monthly/2020/05/09/](http://mysql.taobao.org/monthly/2020/05/09/)
- [https://bbs.huaweicloud.com/blogs/211180](https://bbs.huaweicloud.com/blogs/211180)
