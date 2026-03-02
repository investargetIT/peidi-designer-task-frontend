//  ping 函数, 检测与内网连接是否能在300ms 内响应
export function pingIPUseXHR(ip) {
  return new Promise((resolve, reject) => {
    const start = new Date().getTime();
    const xhr = new XMLHttpRequest();
    let hasResponded = false;

    // console.log(`开始ping IP: ${ip}`);
    xhr.timeout = 300;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (hasResponded) return;
        hasResponded = true;
        const responseTime = new Date().getTime() - start;

        // console.log(
        //   `IP ${ip} 请求完成, readyState: ${xhr.readyState}, 状态码: ${xhr.status}, 响应时间: ${responseTime}ms`
        // );

        // 检查状态码，200-399表示成功响应
        if (xhr.status >= 200 && xhr.status < 400) {
          // console.log(`IP ${ip} 收到成功响应, 状态码: ${xhr.status}, 返回true`);
          resolve(true);
        } else {
          // console.log(
          //   `IP ${ip} 收到错误响应, 状态码: ${xhr.status}, 返回false`
          // );
          resolve(false);
        }
      }
    };

    xhr.onload = function () {
      if (hasResponded) return;
      hasResponded = true;
      const responseTime = new Date().getTime() - start;

      // console.log(
      //   `IP ${ip} onload触发, 状态码: ${xhr.status}, 响应时间: ${responseTime}ms`
      // );

      // 检查状态码，200-399表示成功响应
      if (xhr.status >= 200 && xhr.status < 400) {
        // console.log(`IP ${ip} onload触发且状态码正常, 返回true`);
        resolve(true);
      } else {
        // console.log(`IP ${ip} onload触发但状态码异常, 返回false`);
        resolve(false);
      }
    };

    xhr.onerror = function () {
      if (hasResponded) return;
      hasResponded = true;
      // console.log(`IP ${ip} 发生错误`);
      // 发生错误，返回false
      resolve(false);
    };

    xhr.ontimeout = function () {
      if (hasResponded) return;
      hasResponded = true;
      // console.log(`IP ${ip} 请求超时`);
      resolve(false);
    };

    try {
      // 使用最简单的URL格式
      const url = `http://${ip}/`;
      // console.log(`发送HEAD请求到: ${url}`);

      xhr.open("HEAD", url, true);
      xhr.send();
    } catch (error) {
      // console.log(`IP ${ip} 发生异常:`, error);
      // 如果发生异常，返回false
      resolve(false);
    }
  });
}
