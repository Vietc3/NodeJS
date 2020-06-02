module.exports = {
  friendlyName: 'Convert unit8Array to base64',

  description: 'Convert unit8Array to base64',

  input: {
    unit8Array: {
      type: "ref"
    }
  },

  sync: true,
  
  fn: function(inputs, exits) {
    let binary = '';

    for (let i = 0; i < inputs.unit8Array.byteLength; i++) {
      binary += String.fromCharCode(inputs.unit8Array[i])
    }

    return exits.success(binary);
  }

}