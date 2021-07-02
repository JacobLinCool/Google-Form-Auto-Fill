function parse() {
    const list = [...document.querySelectorAll("div[role=list].freebirdFormviewerViewItemList > div[role=listitem]")].map((qustion_wrap) => {
        let data = JSON.parse("[" + qustion_wrap.querySelector(".m2").dataset.params.substr(4))[0];
        let name = data[1];
        let type = data[3];
        let questions = question_transform(data[4]);
        return { raw: data, name, type, questions };
    });

    return list;
}

function question_transform(question_array) {
    return question_array.map((question) => {
        return {
            id: question[0],
            options: question[1],
            required: question[2],
            row_name: question[3],
        };
    });
}
