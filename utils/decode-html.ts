export const decodeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: use a simple regex-based decoder
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&pi;/g, '\u03C0')
      .replace(/&eacute;/g, '\u00E9')
      .replace(/&ntilde;/g, '\u00F1')
      .replace(/&ouml;/g, '\u00F6')
      .replace(/&uuml;/g, '\u00FC')
      .replace(/&szlig;/g, '\u00DF')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      );
  }

  // Client-side: use DOM parser
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const decodeQuizQuestion = <
  T extends { question: string; correct_answer: string; incorrect_answers: string[] }
>(
  question: T
): T & { allAnswers: string[] } => {
  const decodedQuestion = decodeHtml(question.question);
  const decodedCorrect = decodeHtml(question.correct_answer);
  const decodedIncorrect = question.incorrect_answers.map(decodeHtml);
  const allAnswers = [...decodedIncorrect, decodedCorrect].sort(
    () => Math.random() - 0.5
  );

  return {
    ...question,
    question: decodedQuestion,
    correctAnswer: decodedCorrect,
    incorrectAnswers: decodedIncorrect,
    allAnswers,
  };
};
