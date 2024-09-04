import { useQuiz } from '../context/QuizContext';

function Options({ question }) {
	const { dispatch, answer } = useQuiz();

	const hasAnswered = answer !== null;
	return (
		<div className="options">
			{question.options.map((option, index) => (
				<button
					disabled={hasAnswered}
					key={option}
					className={`btn btn-option ${
						hasAnswered ? (index === question.correctOption ? ' correct' : 'wrong') : ''
					} ${index === answer ? 'answer' : ''}`}
					onClick={() => dispatch({ type: 'newAnswer', payload: index })}
				>
					{option}
				</button>
			))}
		</div>
	);
}
export default Options;
