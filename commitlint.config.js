module.exports = {
	extends: [
		'@commitlint/config-nx-scopes'
	],

	parserPreset: {
      parserOpts: {
	    headerPattern: /^\w*\s\((\w*)\) \[\w*\]\s(.*)$/,
	    headerCorrespondence: ['type', 'scope', 'ticket', 'subject'],
        issuePrefixes: ['UI-', "HTT-"]
      }
    },
};
