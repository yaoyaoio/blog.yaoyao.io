---
title: Rust Vector 学习笔记
date: 2023-12-01
author: 耀耀
layout: post
useHeaderImage: true
headerImage: https://i.yaoyao.io/cover/cover-rust.png
hide: 
categories: rust
tags:
  - rust
published: 2023-12-11T19:40:00
lastUpdated: 2023-12-11T19:30:00
publish: true
---

Rust 中的动态数组类型是 Vec（Vector），也就是向量，中⽂翻译成动态数组。它⽤来存储同一个类型的多个值。并且可以在运行的时候扩容或者缩小。所以也叫动态数组。
在 Go 语言中叫 Slice。在 Python 语言中叫 List。

## 创建 Vector

### 不可变 Vector

```rust
fn main() {
    let v1: Vec<u8> = Vec::new();
    let v2: Vec<u8> = [1, 2, 3].to_vec();
    let v3: Vec<u8> = !vec![1, 2, 3];
    let v4: Vec::<u8> = vec![1, 2, 3];
    let v5 = vec![1, 2, 3];
    let v6 = Vec::<u8>::new();
    let v7 = Vec::new();
}
```

### 可变 Vector

```rust
fn main() {
    let mut v1: Vec<u8> = Vec::new();
    let mut v2: Vec<u8> = [1, 2, 3].to_vec();
    let mut v3: Vec<u8> = !vec![1, 2, 3];
    let mut v4: Vec::<u8> = vec![1, 2, 3];
    let mut v5 = vec![1, 2, 3];
    let mut v6 = Vec::<u8>::new();
    let mut v7 = Vec::new();
}
```

## 创建可变 Vector 并添加元素

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	println!("{:?}", v8);
}
```

## 清空 Vector 中的元素

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 清空元素
	v8.claer();
	println!("{:?}", v8);
}
```

## 添加多个元素到 Vector 中

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 添加多个元素
	v8.extend(&[4,5,6,7]);
	println!("{:?}", v8);
}
```

## 查询 Vector 的容量和长度

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	let capacity = v8.capacity();
	let len = v8.len();
	println!("capacity: {}", capacity);
	println!("len: {}", len;
}
```

## 查询 Vector 是否为空

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 查询 Vec 是否为空
	let is_empty = v8.is_empty();
	println!("is_empty: {}", is_empty);
	// 输出：
	// is_empty: false
}
```

## 通过索引访问 Vector 中的元素

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 通过索引访问 Vec 中的元素
	let first = v8[0];
	let second = v8[1];
	let third = v8[2];
	println!("first: {}", first);
	println!("second: {}", second);
	println!("third: {}", third)
	// 输出：
	// first: 0
	// second: 1
	// third: 2
	// 如果索引超出
}
```

如果索引超出 Vector 的长度，会发生什么？

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	let last = v8[10];
	// 如果索引超出当前 Vec 长度
	println!("last: {}", last);
	// 输出：
	// index out of bounds: the len is 4 but the index is 10
}
```

## 通过索引修改 Vector 中的元素

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 通过索引修改 Vec 中的元素
	v8[0] = 10;
	println!("v8: {:?}", v8);
	// 输出：
	// v8: [10, 1, 2, 3]
}
```

## 通过索引删除 Vector 中的元素

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 通过索引删除 Vec 中的元素
	v8.remove(0);
	println!("v8: {:?}", v8);
	// 输出：
	// v8: [1, 2, 3]
}
```

## 遍历 Vector 中的元素

```rust
fn main(){
    let mut v8: Vec<u8> = Vec::new();
	v8.push(0);
	v8.push(1);
	v8.push(2);
	v8.push(3);
	// 使用循环和下标遍历 Vec 中的元素
	for i in 0..v8.len() {
	    println!("v8[{}]: {}", i, v8[i]);
	}
	// 使用循环和迭代器遍历 Vec 中的元素
	for entry in v8.iter() {
	    println!("entry: {}", entry);
	}
}
```

## 转换为 &[8] 或者 &[T]

要将 Vector 转换为 &[u8]，您可以使用切片的引用符号 &，在 Vector 上使用 as_slice() 或 as_ref() 方法。下面是三种方法的示例：

```rust
fn main() {
    let vec: Vec<u8> = vec![1, 2, 3, 4, 5];
	// 使用切片引用符号 &
    let slice: &[u8] = &vec;                   
	// 输出: Slice: [1, 2, 3, 4, 5]
    println!("Slice: {:?}", slice);            
	// 使用 as_slice() 方法
    let slice_ref: &[u8] = vec.as_slice();      
	// 输出: Slice Ref: [1, 2, 3, 4, 5]
    println!("Slice Ref: {:?}", slice_ref);    
	// 使用 as_ref() 方法
    let slice_ref2: &[u8] = vec.as_ref();       
	// 使用 as_ref() 方法
    println!("Slice Ref 2: {:?}", slice_ref2);  
	let slice_ref_3 = &vec[..];
	println!("Slice Ref 3: {:?}", slice_ref3);  
}
```

这样，您就可以将 Vector 转换为 &[u8] 切片来使用。&[u8]可以使用 `Tokio Bytes` 库来增加更多的功能。
