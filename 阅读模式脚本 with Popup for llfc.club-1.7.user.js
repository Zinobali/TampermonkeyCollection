// ==UserScript==
// @name         阅读模式脚本 with Popup for llfc.club
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  一键提取类名为article-data的元素的纯文本内容，并在新窗口中显示，按钮置于顶层，排除article-info和倒数两个<p>节点
// @author       YourName
// @match        *://*.llfc.club/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建阅读模式按钮
    var button = document.createElement("button");
    button.innerHTML = "进入阅读模式";
    button.style.position = "fixed";
    button.style.top = "5px"; // 向下移动20px
    button.style.right = "5px";
    button.style.zIndex = "99999";  // 置于顶层
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.fontSize = "16px";

    document.body.appendChild(button);

    // 按钮点击事件：提取article-data类元素的文本，并在新窗口显示
    button.addEventListener("click", function() {
        // 获取所有 article-data 类的元素
        var articles = document.getElementsByClassName('article-data');

        if (articles.length > 0) {
            // 创建新窗口
            var newWindow = window.open("", "_blank", "width=800,height=600");
            newWindow.document.write("<html><head><title>阅读模式</title></head><body><pre id='content' style='white-space: pre-wrap; font-family: Arial, sans-serif;'></pre></body></html>");

            // 拼接所有 article-data 的纯文本
            var textContent = "";
            Array.from(articles).forEach(function(article) {
                textContent += extractTextContent(article) + "\n\n"; // 处理每个 article-data 元素
            });

            // 将纯文本插入到新窗口中
            newWindow.document.getElementById('content').textContent = textContent;
            newWindow.document.close();
        } else {
            alert("未找到 article-data 类的元素！");
        }
    });

    // 递归提取元素及其子元素的纯文本内容，排除article-info和倒数两个<p>
    function extractTextContent(element) {
        // 过滤掉class为article-info的元素
        var articleInfoElements = element.getElementsByClassName('article-info');
        Array.from(articleInfoElements).forEach(function(infoElem) {
            infoElem.remove();
        });

        // 获取所有<p>标签
        var paragraphs = element.getElementsByTagName('p');
        var numParagraphs = paragraphs.length;

        // 移除倒数两个<p>标签
        if (numParagraphs > 2) {
            paragraphs[numParagraphs - 1].remove();
            paragraphs[numParagraphs - 2].remove();
        }

        // 返回剩余的文本内容
        var text = element.innerText || element.textContent;
        return text.trim(); // 去除多余的空格
    }
})();
