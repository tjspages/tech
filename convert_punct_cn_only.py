import sys
import re
import os

def convert_punctuation(text):
    """仅当标点前是中文时才转换为全角，不影响[^1]、(1)、链接等"""

    mapping = {
        ',': '，',
        '.': '。',
        '?': '？',
        '!': '！',
        ':': '：',
        ';': '；',
        '(': '（',
        ')': '）',
        '[': '【',
        ']': '】',
        '{': '｛',
        '}': '｝',
    }

    # 1️⃣ 只处理“前面是中文”的半角标点
    def repl(match):
        left = match.group(1)
        punc = match.group(2)
        return left + mapping.get(punc, punc)

    text = re.sub(r'([\u4e00-\u9fff])([,\.?!:;])', repl, text)

    # 2️⃣ 智能处理双引号配对：成对转换，只处理包含中文的引号对
    def convert_quote_pairs(input_text, quote_char, open_char, close_char):
        result = []
        i = 0
        while i < len(input_text):
            if input_text[i] == quote_char:
                # 找到第一个引号，查找配对的第二个引号
                start = i
                i += 1
                # 找到匹配的结束引号
                while i < len(input_text) and input_text[i] != quote_char:
                    i += 1

                if i < len(input_text):
                    # 找到了配对的引号
                    content = input_text[start+1:i]
                    # 检查引号内是否包含中文
                    has_chinese = bool(re.search(r'[\u4e00-\u9fff]', content))

                    if has_chinese:
                        # 包含中文，转换为全角引号
                        result.append(open_char + content + close_char)
                    else:
                        # 不包含中文，保持原样
                        result.append(quote_char + content + quote_char)
                    i += 1
                else:
                    # 没找到配对，保持原样
                    result.append(input_text[start:])
                    break
            else:
                result.append(input_text[i])
                i += 1
        return ''.join(result)

    # 处理双引号配对
    text = convert_quote_pairs(text, '"', '\u201c', '\u201d')
    # 处理单引号配对
    text = convert_quote_pairs(text, "'", '\u2018', '\u2019')

    return text


def process_file(file_path):
    """读取文件 -> 转换 -> 写回"""
    if not os.path.isfile(file_path):
        print(f"❌ 文件不存在: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        text = f.read()

    converted = convert_punctuation(text)

    backup_path = file_path + '.bak'
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"✅ 已备份原文件: {backup_path}")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(converted)
    print(f"✅ 转换完成: {file_path}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python convert_punct_cn_front_only.py yourfile.txt")
        sys.exit(1)

    for path in sys.argv[1:]:
        process_file(path)
