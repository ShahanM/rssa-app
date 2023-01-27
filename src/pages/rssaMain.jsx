import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { API } from '../constants';
import MovieGrid from '../widgets/movieGrid';
import MovieRibbonItem from '../widgets/movieRibbonItem';
import { BouncingLoader } from '../widgets/recLoader';

export default function Rssa() {
	let userid = 1;
	const [ratedMoviesData, setRatedMoviesData] = useState([]);
	const [ratedMovies, setRatedMovies] = useState([]);
	const [recommendedMovies, setRecommendedMovies] = useState([]);
	const [movies, setMovies] = useState([]);
	const [conditionRecommendations, setConditionRecommendations] = useState([]);
	const [rssaCondition, setRssaCondition] = useState(-1);
	const [loading, setLoading] = useState(false);
	const [recLoading, setRecLoading] = useState(false);
	const [conLoading, setConLoading] = useState(false);
	// const [itemsPerPage, setItemsPerPage] = useState(12);
	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = 16;

	const rateMoviesHandler = (newRating, movieid) => {
		const isNew = !ratedMoviesData.some(item => item.item_id === movieid);
		let updatevisited = [];
		let updaterated = [];
		if (isNew) {
			let updatedmovie = movies.find(item => item.movie_id === movieid);
			updatedmovie.rating = newRating;
			updatevisited = [...ratedMoviesData, { item_id: movieid, rating: newRating }];
			updaterated = [...ratedMovies, updatedmovie];
		} else {
			updatevisited = ratedMoviesData.map(item => (
				item.item_id === movieid ? {
					...item, rating: newRating
				} : item
			));
			updaterated = ratedMovies.map(item => (
				item.movie_id === movieid ? {
					...item, rating: newRating
				} : item));
		}

		setRatedMovies(updaterated);
		setRatedMoviesData(updatevisited);
		setMovies(movies.map(movie => (
			movie.movie_id === movieid ? {
				...movie, rating: newRating
			} : movie)));
	}

	const fetchMovies = async () => {
		const offset = (currentPage - 1) * itemsPerPage * 2;
		const limit = itemsPerPage * 2;
		fetch(API + 'movies/?skip=' + offset + '&limit=' + limit, {
			method: 'GET',
			header: {
				'Content-Type': 'application/json',
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "*"
			}
		})
			.then((response): Promise<movie[]> => response.json())
			.then((newmovies: movie[]) => { setMovies([...movies, ...newmovies]); })
			.catch((error) => console.log(error));
	}

	useEffect(() => {
		fetchMovies();
	}, []);

	useEffect(() => {
		// console.log("movies changed");
		if (ratedMoviesData.length > 0) {
			submitHandler(0);
			if (rssaCondition > 0) {
				submitHandler(rssaCondition);
			}
		} else {
			setRecommendedMovies([]);
			setConditionRecommendations([]);
		}
		console.log('RatedMoviesData', ratedMoviesData);
		console.log('RatedMovies', ratedMovies);
	}, [ratedMoviesData]);

	const submitHandler = (recType) => {
		if (recType === 0) {
			setRecLoading(true);
		} else {
			setConLoading(true);
		}
		setLoading(true);
		if (ratedMovies.length > 0) {
			fetch(API + 'recommendation/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					"Access-Control-Allow-Headers": "*",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "*"
				},
				body: JSON.stringify({
					user_id: userid,
					ratings: ratedMoviesData,
					rec_type: recType
				})
			})
				.then((response): Promise<movie[]> => response.json())
				.then((movies: movie[]) => {
					if (recType === 0) {
						setRecommendedMovies([...movies]);
						setRecLoading(false);
					} else {
						setConditionRecommendations([...movies]);
						setConLoading(false);
					}
					setLoading(false);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
					setRecLoading(false);
					setConLoading(false);
				});
		}
	}

	const rssaConditionHandler = (event) => {
		const condition = event.target.value;
		setRssaCondition(condition);
		if (condition > 0) {
			submitHandler(condition);
		}
	}

	const removeMovieHandler = (movieId) => {
		setRatedMovies(ratedMovies.filter(movie => movie.movie_id !== movieId));
		setRatedMoviesData(ratedMoviesData.filter(movie => movie.item_id !== movieId));
		setMovies(movies.map(movie => (
			movie.movie_id === movieId ? {
				...movie, rating: 0
			} : movie)));
	}

	const updateCurrentPage = (page) => {
		setCurrentPage(page);
	}

	return (
		<Container>
			<Row>
				<Col md={5} className="viewport">
					<MovieGrid ratingCallback={rateMoviesHandler} userid={userid} movies={movies}
						pagingCallback={updateCurrentPage} itemsPerPage={itemsPerPage} dataCallback={fetchMovies} />
				</Col>
				<Col md={7}>
					<div className="sidePanel">
						{/* <div> */}
						<h5>Movies You Rated</h5>
						<div className="movieRibbon">
							{ratedMovies.length > 0 && ratedMovies.map((movie) =>
								<MovieRibbonItem key={'"rated_' + movie.movie_id + '"'}
									isLoading={false}
									movieItem={movie} showStarRating={true} allowRemove={true}
									removeItemCallback={removeMovieHandler} />)}
						</div>
						{/* </div> */}
					</div>
					<div className="sidePanel">
						<div>
							<Row>
								<Col>
									<h5>Movies you think we will like</h5>
								</Col>
								<Col sm={{ span: 2, offset: 2 }}>
									{/* <Button variant="primary" disabled={loading || ratedMovies.length === 0}
										className={recommendedMovies.length === 0 ? "hideElement" : ""}
										onClick={() => submitHandler(0)}>
										Update
									</Button> */}
								</Col>
							</Row>
							<Row>
								<div className="movieRibbon recRibbon">
									{
										// loading && <BouncingLoader key={"topNrecommendationLoader"} text="Loading..." />
									}
									{recommendedMovies.length > 0 ? recommendedMovies.map((movie) =>
										<MovieRibbonItem key={'"rec_' + movie.movie_id + '"'}
											isLoading={recLoading}
											movieItem={movie} showStarRating={false} containerClass="recItem" />)
										:
										<div className="ribbonButtonDiv">
											<p>
												Please rate movies on the left to get recommendations.
											</p>
											{/* <Button variant="primary" disabled={!loading && ratedMovies.length === 0}
												onClick={() => submitHandler(0)}>
												Get Recommendations
											</Button> */}
										</div>
									}
								</div>
							</Row>
						</div>
						<div>
							<Row>
								<Col>
									<h5>These are movies that </h5>
								</Col>
								<Col sm={{ span: 2, offset: 2 }}>
									{/* <Button variant="primary" disabled={loading || rssaCondition === -1}
										className={conditionRecommendations.length === 0 ? "hideElement" : ""}
										onClick={() => submitHandler(rssaCondition)}>
										Update
									</Button> */}
								</Col>
							</Row>
							<Row>
								<Form.Group>
									<Form.Select className="panelOption" variant="outline-secondary"
										title="Dropdown" id="input-group-dropdown" disabled={loading || ratedMovies.length === 0}
										onChange={(evt) => rssaConditionHandler(evt)} value={rssaCondition}>
										<option value="-1">Please choose an option</option>
										<option value="1">we think are controversial.</option>
										<option value="2">we think you will hate.</option>
										<option value="3">we think you will be the first to try.</option>
										<option value="4">we have no idea about.</option>
									</Form.Select>
								</Form.Group>
								<div className="movieRibbon recRibbon">
									{
										// loading && <BouncingLoader key={"conditionRecLoader"} text="Loading..." />
									}
									{conditionRecommendations.length > 0 && conditionRecommendations.map((movie) =>
										<MovieRibbonItem key={'"recex_' + movie.movie_id + '"'}
											isLoading={conLoading}
											movieItem={movie} showStarRating={false} containerClass="recItem" />)}
								</div>
							</Row>
						</div>
					</div>
				</Col>
			</Row>
		</Container>
	);
}