import React from 'react';


export default function StatusConsole(props) {

	return (
		<div id="status-console">
			{
				props.consoleOutputs.map((outputstr, i) => <p key={'"cout_'+i+'"'}>{"> " + outputstr}</p>)
			}
		</div>
	);
}