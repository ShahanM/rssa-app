import React from 'react';
import StarRatings from 'react-star-ratings';
import Button from 'react-bootstrap/Button';


export default function MovieRibbonItem(props) {

	const allowremove = props.allowRemove || false;
	const allowrating = props.allowRating || false;
	const containerClass = props.containerClass || "";
	const wiggle = props.isLoading || false ? "wiggleItem " : "";

	return (
		<div className="movieRibbonItemWrapper">
			<div className={"movieRibbonItem " + wiggle + containerClass} style={{
				backgroundImage: "url(" + props.movieItem.poster + "), url('" + 'defaultMovieIco' + "')",
			}}>
				{allowremove &&
					<div className="removeItem">
						<Button onClick={() => props.removeItemCallback(props.movieItem.movie_id)}> x </Button>
					</div>
				}
				<div className="movieRibbonItemLabel" style={{ position: "absolute" }}>
					{props.movieItem.title + " (" + props.movieItem.year + ")"}
				</div>
			</div>
			{props.showStarRating ?
				<div className="movieRibbonStars">
					<StarRatings
						rating={props.movieItem.rating}
						starRatedColor="rgb(252,229,65)"
						starHoverColor="rgb(252,229,65)"
						starDimension="11px"
						starSpacing="2px"
						numberOfStars={5} />
				</div>
				: <></>}
		</div>
	);
}

export function RateableMovieRibbonItem(props){

}