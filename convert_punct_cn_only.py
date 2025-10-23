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

    # 2️⃣ 智能处理引号：只在“中文后面”出现时转为开引号
    text = re.sub(r'([\u4e00-\u9fff])"', r'\1“', text)
    text = re.sub(r"([\u4e00-\u9fff])'", r"\1‘", text)

    # 3️⃣ 中文前的引号变为闭引号
    text = re.sub(r'"([\u4e00-\u9fff])', r'”\1', text)
    text = re.sub(r"'([\u4e00-\u9fff])", r'’\1', text)

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
