function parse() {
    const questions = [...document.querySelectorAll("div[role=list].freebirdFormviewerViewItemList > div[role=listitem]")].map((qustion_wrap) => {
        let data = JSON.parse("[" + qustion_wrap.querySelector(".m2").dataset.params.substr(4))[0];
        let name = data[1];
        let type = data[3];
        return data;
    });

    return questions;
}
