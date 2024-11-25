
const questions = [
  'Comment te sens-tu après cette semaine ? (1 à 5)',
  'Quelle a été ta plus grande réussite cette semaine ?',
  'Quelle difficulté as-tu rencontrée cette semaine ?',
  'Que pourrais-tu améliorer la semaine prochaine ?',
  'De 1 à 5, comment évalues-tu ton énergie cette semaine ?'
];

 const randomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
};

export { randomQuestion };