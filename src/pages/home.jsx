import React from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";


export default function Home() {

	return (
		<Container>
			<div style={{height:"450px", margin:"5em"}}>
				<Link to="/rssa">
					<Button variant="primary">RSSA</Button>
				</Link>
			</div>
		</Container >
	);
}