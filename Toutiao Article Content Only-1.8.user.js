// ==UserScript==
// @name         Toutiao Article Content Only
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  只显示class为article-content及其子内容，添加复制标题、复制内容和保存内容为TXT的功能
// @author       Zinobali
// @match        *://www.toutiao.com/article*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完毕
    window.onload = function() {
        // 获取class为article-content的元素
        var articleContent = document.querySelector('.article-content');

        if (articleContent) {
            // 隐藏body中的所有元素
            document.body.innerHTML = '';

            // 创建一个新的div来容纳article-content
            var newDiv = document.createElement('div');
            newDiv.appendChild(articleContent.cloneNode(true));

            // 移除类名为article-meta的元素
            var metaElements = newDiv.querySelectorAll('.article-meta');
            metaElements.forEach(el => el.remove());

            // 获取第一个h1元素作为标题
            var titleElement = newDiv.querySelector('h1');
            var titleText = titleElement ? titleElement.innerText.trim() : '无标题';

            // 将新的div添加到body中
            document.body.appendChild(newDiv);

            // 创建复制标题按钮
            var copyTitleButton = document.createElement('button');
            copyTitleButton.innerText = 'title';
            copyTitleButton.style.position = 'fixed';
            copyTitleButton.style.top = '10px';
            copyTitleButton.style.right = '150px';
            copyTitleButton.style.zIndex = '1000';

            // 添加复制标题按钮的点击事件
            copyTitleButton.addEventListener('click', function() {
                // 创建一个临时的textarea来存储标题内容
                var tempTextArea = document.createElement('textarea');
                document.body.appendChild(tempTextArea);

                // 设置textarea的值
                tempTextArea.value = titleText;

                // 选择并复制文本
                tempTextArea.select();
                document.execCommand('copy');

                // 移除临时的textarea
                document.body.removeChild(tempTextArea);

                // 提示用户复制成功
                // alert('标题已复制到剪贴板！');
            });

            // 将复制标题按钮添加到body中
            document.body.appendChild(copyTitleButton);

            // 创建复制文本内容按钮
            var copyTextButton = document.createElement('button');
            copyTextButton.innerText = 'content';
            copyTextButton.style.position = 'fixed';
            copyTextButton.style.top = '10px';
            copyTextButton.style.right = '80px';
            copyTextButton.style.zIndex = '1000';

            // 添加复制文本内容按钮的点击事件
            copyTextButton.addEventListener('click', function() {
                // 创建一个临时的textarea来存储文本内容
                var tempTextArea = document.createElement('textarea');
                document.body.appendChild(tempTextArea);

                // 获取所有文本内容，忽略图片和article-meta，并排除第一个h1
                var textContent = Array.from(newDiv.querySelectorAll('p, span, div'))
                    .filter(el => el.innerText && !el.querySelector('img') && !el.classList.contains('article-meta') && el !== titleElement)
                    .map(el => el.innerText.trim())
                    .filter((value, index, self) => self.indexOf(value) === index) // 去重
                    .join('\n');

                // 设置textarea的值
                tempTextArea.value = textContent;

                // 选择并复制文本
                tempTextArea.select();
                document.execCommand('copy');

                // 移除临时的textarea
                document.body.removeChild(tempTextArea);

                // 提示用户复制成功
                // alert('文本内容已复制到剪贴板！');
            });

            // 将复制文本内容按钮添加到body中
            document.body.appendChild(copyTextButton);

            // 创建保存为TXT按钮
            var saveButton = document.createElement('button');
            saveButton.innerText = 'TXT';
            saveButton.style.position = 'fixed';
            saveButton.style.top = '10px';
            saveButton.style.right = '40px';
            saveButton.style.zIndex = '1000';

            // 添加保存按钮的点击事件
            saveButton.addEventListener('click', function() {
                // 获取所有文本内容，忽略图片和article-meta，并排除第一个h1
                var textContent = Array.from(newDiv.querySelectorAll('p, span, div'))
                    .filter(el => el.innerText && !el.querySelector('img') && !el.classList.contains('article-meta') && el !== titleElement)
                    .map(el => el.innerText.trim())
                    .filter((value, index, self) => self.indexOf(value) === index) // 去重
                    .join('\n');

                // 生成TXT文件内容（不包括标题）
                var fileContent = textContent;

                // 创建一个blob对象
                var blob = new Blob([fileContent], { type: 'text/plain' });
                var url = URL.createObjectURL(blob);

                // 创建一个临时的a标签用于下载
                var a = document.createElement('a');
                a.href = url;
                a.download = titleText + '.txt';

                // 模拟点击下载
                document.body.appendChild(a);
                a.click();

                // 移除临时的a标签
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });

            // 将保存按钮添加到body中
            document.body.appendChild(saveButton);
        } else {
            console.log('未找到class为article-content的元素');
        }
    };
})();
