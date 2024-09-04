import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();
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
const SECS_PER_QUESTION = 30;

function reducer(state, action) {
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
function QuizProvider({ children }) {
	const [{ questions, status, index, answer, score, highscore, secondsRemaining }, dispatch] = useReducer(
		reducer,
		initialState
	);
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
		<QuizContext.Provider
			value={{
				questions,
				status,
				index,
				answer,
				score,
				highscore,
				secondsRemaining,
				numQuestions,
				maxPossibleScore,
				dispatch,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}
function useQuiz() {
	const context = useContext(QuizContext);
	if (!context) {
		throw new Error('useQuiz must be used within a QuizProvider');
	}
	return context;
}
export { QuizProvider, useQuiz };
