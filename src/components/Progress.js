function Progress({ index, numQuestions, score, maxPossibleScore, answer }) {
	return (
		<header className="progress">
			<progress max={15} value={index + Number(answer !== null)} />
			<p>
				Question <strong>{index + 1}</strong> / {numQuestions}
			</p>
			<p>
				<strong>{score}</strong> / {maxPossibleScore}
			</p>
		</header>
	);
}
export default Progress;
