import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Timer from './Timer';
import Footer from './Footer';
const SECS_PER_QUESTION = 30;
const initialState = {
	questions: [],
	//loading,error,ready,active,finished
	status: 'loading',
	index: 0,
	answer: null,
	score: 0,
	highscore: 0,
	secondsRemaining: null,
};
function reducer(state, action) {
	console.log(action);
	switch (action.type) {
		case 'setQuestions':
			return { ...state, questions: action.payload, status: 'ready' };
		case 'setError':
			return { ...state, status: 'error' };
		case 'setActive':
			return { ...state, status: 'active', secondsRemaining: state.questions.length * SECS_PER_QUESTION };
		case 'newAnswer':
			const currentQuestion = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				score:
					action.payload === currentQuestion.correctOption
						? state.score + currentQuestion.points
						: state.score,
			};
		case 'nextQuestion':
			return { ...state, index: state.index + 1, answer: null };
		case 'finish':
			return {
				...state,
				status: 'finish',
				highscore: state.score > state.highscore ? state.score : state.highscore,
			};
		case 'restart':
			return { ...initialState, status: 'ready', questions: state.questions };
		case 'tick':
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? 'finish' : state.status,
			};
		default:
			return state;
	}
}
function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { questions, status, index, answer, score, highscore, secondsRemaining } = state;
	const numQuestions = questions.length;
	const maxPossibleScore = questions.reduce((prev, cur) => prev + cur.points, 0);
	useEffect(function () {
		async function fetchQuestions() {
			try {
				const response = await fetch('http://localhost:3001/questions');
				const questions = await response.json();
				dispatch({ type: 'setQuestions', payload: questions });
			} catch (err) {
				console.error(err);
				dispatch({ type: 'setError' });
			}
		}
		fetchQuestions();
	}, []);
	return (
		<div className="app">
			<Header></Header>
			<Main>
				{status === 'loading' && <Loader />}
				{status === 'error' && <Error />}
				{status === 'ready' && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
				{status === 'active' && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							score={score}
							maxPossibleScore={maxPossibleScore}
							answer={answer}
						/>
						<Question question={questions[index]} dispatch={dispatch} answer={answer} />
						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
						</Footer>
					</>
				)}
				{status === 'finish' && (
					<FinishScreen
						score={score}
						maxPossibleScore={maxPossibleScore}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}

export default App;
