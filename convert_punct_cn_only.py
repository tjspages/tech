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

    # \u524d\u4e00\u4e2a\u5b57\u7b26\u662f\u4e2d\u6587\uff0c\u6216\u662f\u4e2d\u6587\u6807\u70b9\uff08\u201d\u3001\uff09\u3001\u300b\u7b49\uff09\uff0c\u90fd\u7b97
    CN_LEFT = r'[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef\u2018-\u201f]'
    text = re.sub(CN_LEFT + r'([,\.?!:;])', lambda m: m.group(0)[0] + mapping.get(m.group(1), m.group(1)), text)

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

    # 3\ufe0f\u20e3 \u5f15\u53f7\u8f6c\u5168\u89d2\u540e\u518d\u8865\u4e00\u6b21\uff0c\u5904\u7406\u7d27\u8ddf\u5728 \u201d\u300f\uff09\u540e\u9762\u7684\u534a\u89d2\u6807\u70b9
    text = re.sub(CN_LEFT + r'([,\.?!:;])', lambda m: m.group(0)[0] + mapping.get(m.group(1), m.group(1)), text)

    return text


def process_file(file_path):
    """读取文件 -> 转换 -> 写回"""
    if not os.path.isfile(file_path):
        print(f"❌ 文件不存在: {file_path}")
        return

    with open(file_path, 'r', encoding='utf-8', newline='') as f:
        text = f.read()

    converted = convert_punctuation(text)

    if converted == text:
        print(f"➖ 无需转换: {file_path}")
        return

    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        f.write(converted)
    print(f"✅ 转换完成: {file_path}")


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except AttributeError:
        pass

    if len(sys.argv) < 2:
        print("用法: python convert_punct_cn_front_only.py yourfile.txt")
        sys.exit(1)

    for path in sys.argv[1:]:
        process_file(path)
