import { useQuiz } from '../context/QuizContext';

function FinishScreen() {
	const { score, maxPossibleScore, highscore, dispatch } = useQuiz();

	const percentage = Math.ceil((score / maxPossibleScore) * 100);
	let emoji;
	if (percentage < 50) {
		emoji = '😢';
	} else if (percentage < 70) {
		emoji = '😊';
	} else {
		emoji = '🎉';
	}
	return (
		<>
			<p className="result">
				<span>{emoji}</span>
				You scored <strong>{score}</strong> out of {maxPossibleScore} ({Math.ceil(percentage)}
				%)
			</p>
			<p className="highscore">(Highscore: {highscore} points )</p>
			<button className="btn btn-ui" onClick={() => dispatch({ type: 'restart' })}>
				Restart quiz
			</button>
		</>
	);
}
export default FinishScreen;
