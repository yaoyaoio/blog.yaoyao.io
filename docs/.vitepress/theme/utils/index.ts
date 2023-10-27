import {PostPageFrontmatter} from "../types";

export function formatDate(d: any, fmt = "yyyy-MM-dd hh:mm:ss") {
  if (!(d instanceof Date)) {
    d = new Date(d);
  }
  const o: any = {
    "M+": d.getMonth() + 1, // 月份
    "d+": d.getDate(), // 日
    "h+": d.getHours(), // 小时
    "m+": d.getMinutes(), // 分
    "s+": d.getSeconds(), // 秒
    "q+": Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${d.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
  }
  return fmt;
}

export function isCurrentWeek(date: Date, target?: Date) {
  const now = target || new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const oneDay = 1000 * 60 * 60 * 24;
  const nowWeek = today.getDay();
  // 本周一的时间
  const startWeek =
    today.getTime() - (nowWeek === 0 ? 6 : nowWeek - 1) * oneDay;
  return +date >= startWeek && +date <= startWeek + 7 * oneDay;
}

export function formatShowDate(date: Date | string) {
  const source = date ? +new Date(date) : +new Date();
  const now = +new Date();
  const diff = now - source > 0 ? now - source : 60 * 1000;
  const oneSeconds = 1000;
  const oneMinute = oneSeconds * 60;
  const oneHour = oneMinute * 60;
  const oneDay = oneHour * 24;
  const oneWeek = oneDay * 7;
  const oneMonth = oneDay * 30;
  const oneYear = oneDay * 365;
  if (diff < oneMinute) {
    return `${Math.floor(diff / oneSeconds)}秒前`;
  }
  if (diff < oneHour) {
    return `${Math.floor(diff / oneMinute)}分钟前`;
  }
  if (diff < oneDay) {
    return `${Math.floor(diff / oneHour)}小时前`;
  }
  if (diff < oneWeek) {
    return `${Math.floor(diff / oneDay)}天前`;
  }
  if (diff < oneMonth) {
    return `${Math.floor(diff / oneWeek)}周前`;
  }
  if (diff < oneYear) {
    const months = Math.floor(diff / oneMonth);
    if (months > 0) {
      return `${months}月前`;
    }
  }

  const years = Math.floor(diff / oneYear);
  if (years > 0 && years < 3) {
    return `${years}年前`;
  } else {
    return formatDate(new Date(date), "yyyy-MM-dd");
  }
}


export const formatDateString = (date: string): string => {
  const dateJson = new Date(date).toJSON();

  const dateStr = new Date(+new Date(dateJson) + 8 * 3600 * 1000)
    .toISOString()
    .replace(/T/g, " ")
    .replace(/\.[\d]{3}Z/, "");

  return dateStr.split(" ")[0];
};

export const resolveDate = (date: string, type: "year" | "month" | "day") => {
  const dateStr = formatDateString(date).replace(/-/g, "/");
  const dateObj = new Date(dateStr);

  const info = {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate()
  };

  return info[type].toString();
};

export interface PostDataWithDate {
  date: string;
  data: PostPageFrontmatter[];
}

export const getPostsByYear = (posts: PostPageFrontmatter[]) => {
  const formatPages = {} as Record<string, PostPageFrontmatter>;

  const formatPagesArr = [] as Array<{
    year: string;
    data: PostPageFrontmatter[];
  }>;

  for (const post of posts) {
    if (post.date.raw) {
      const pageDateYear = resolveDate(post.date.raw, "year");
      // @ts-ignore
      if (formatPages[pageDateYear]) {
        // @ts-ignore
        formatPages[pageDateYear].push(post);
      } else {
        // @ts-ignore
        formatPages[pageDateYear] = [post];
      }
    }
  }
  for (const key in formatPages) {
    formatPagesArr.unshift({
      // @ts-ignore
      year: key,
      // @ts-ignore
      data: formatPages[key]
    });
  }
  return formatPagesArr;
}


export const formatPostDate = (date: string) => {
  const dateStr = formatDateString(date).replace(/-/g, "/");
  const dateObj = new Date(dateStr);

  const info = {
    year: dateObj.getFullYear(),
    month: String(dateObj.getMonth() + 1).padStart(2, "0"),
    day: String(dateObj.getDate()).padStart(2, "0")
  };

  return `${info.year}-${info.month}-${info.day}`;
}
