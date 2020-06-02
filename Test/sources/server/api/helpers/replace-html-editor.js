module.exports = {
  friendlyName: 'Replace html editor',

  description: 'Replace html editor',

  inputs: {
    data: {
      type: "ref"
    },
    htmlEditor: {
      type: "string"
    }
  },

  sync: true,

  fn: function (inputs, exits) {
    let { data, htmlEditor } = inputs;

    for (let i in data) {

      if (typeof data[i] === "object") {

        let findStart = htmlEditor.indexOf(`<!--<${i}>-->`);
        let findEnd = htmlEditor.indexOf(`<!--</${i}>-->`);
        let sliceStart = htmlEditor.slice(0, findStart);
        let sliceReplace = htmlEditor.slice(findStart + `<!--</${i}>-->`.length, findEnd);
        let sliceEnd = htmlEditor.slice(findEnd + `<!--</${i}>-->`.length, htmlEditor.length);
        let _html = "";

        _.forEach(data[i], item => {
          let sliceReplace_copy = sliceReplace.slice()

          for (let j in item) {
            sliceReplace_copy = sliceReplace_copy.replace(`{${j}}`, item[j])
          }

          _html += sliceReplace_copy
        })

        htmlEditor = sliceStart + _html + sliceEnd;

      }
      else {
        htmlEditor = htmlEditor.split(`{${i}}`).join(data[i])
      }

    }

    return exits.success(htmlEditor);
  }
}