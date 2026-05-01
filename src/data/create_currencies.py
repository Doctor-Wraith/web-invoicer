import json

def main():
    
    first_lines = """
export interface currency {
    code: string
    name: string
}

const currencies: currency[] = [
"""

    with open("currencies.json", 'r', encoding="utf-8") as file:
        data = json.load(file)
        
    with open("currencies.tsx", 'w', encoding="utf-8") as file:
        file.write(first_lines)
        for line in data:
            file.write(f'\t{"{"} code: "{line}", name: "{data[line]['name']}"{"}"},\n')
        file.write("];\n\nexport default currencies")

if __name__ == "__main__":
    main()