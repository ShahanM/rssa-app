import React from "react";

export function BouncingLoader(props) {
	return (
		<div className="loader">
			<h1>
				{[...props.text].map(letter =>
					<span>{letter}</span>
					)
				}
			</h1>
		</div>
	);
}