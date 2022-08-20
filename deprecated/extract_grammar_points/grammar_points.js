function process() {
    const list = document.getElementById('listOfGrammar');

    let sql = "INSERT INTO grammar_point (japanese, english, grammar, jlpt, url) VALUES "

    const children = list.children;
    for (var i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.className == "jl-row") {
            const language = child.getElementsByClassName("jl-link");

            const [english, japanese] = language;

            const englishTab = english.text.split('/')
            const englishTabClean = englishTab.map(element => {
                return element.replace('\n                        ', ' ').trim();
            });
            //console.log(englishTabClean)

            const japaneseTab = japanese.text.split('/')
            const japaneseTabClean = japaneseTab.map(element => {
                return element.replace('\n                        ', ' ').trim();
            });
            //console.log(japaneseTabClean)

            const grammar = child.getElementsByClassName("jl-td-gm")[0];
            const grammarTab = grammar.outerText.split(';')
            const grammarTabClean = grammarTab.map(element => {
                return element.replace('\n                        ', ' ').trim();
            });
            //console.log(grammarTabClean)

            const jlpt = +child.getElementsByClassName("text-white")[0].text.replace('N', '');
            //console.log(jlpt)

            const url = japanese.href
            //console.log(url)

            //console.log(englishTabClean, japaneseTabClean, grammarTabClean)
            //(japanese, english, grammar, jlpt, url)
            sql += `('${JSON.stringify(japaneseTabClean)}', '${JSON.stringify(englishTabClean)}', '${JSON.stringify(grammarTabClean)}', ${jlpt}, '${url}'),`;
        }
    }
    console.log(sql.slice(0, -1))
}