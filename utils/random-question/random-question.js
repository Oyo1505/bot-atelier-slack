
const questions = [
  {
    question : 'Comment te sens-tu après cette semaine ? (1 à 5)',
    blocks : [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Quelle a été ta plus grande réussite cette semaine ?'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '1 : Ca va pas du tout'
            },
            value: 'reponse_1',
            action_id: 'reponse_1_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '2 : Pas ouf'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '3 : Plutot ok.'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '4 : Bonne semaine.'
            },
            value: 'reponse_4',
            action_id: 'reponse_4_action'
          },    {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '5 : Excellente semaine.'
            },
            value: 'reponse_5',
            action_id: 'reponse_5_action'
          }

        ]
      }
    ],
  },
  {
    question : 'Quelle a été ta plus grande réussite cette semaine ?',
    blocks : [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Quelle a été ta plus grande réussite cette semaine ?'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai terminé un projet ! 🎉'
            },
            value: 'reponse_1',
            action_id: 'reponse_1_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai appris quelque chose de nouveau ! 📚'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai aidé un collègue ! 🤝'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_action'
          }
        ]
      }
    ],
  },
  {
    question : 'Quelle difficulté as-tu rencontrée cette semaine ?',
    blocks : [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Quelle difficulté as-tu rencontrée cette semaine ?',
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai terminé un projet ! 🎉'
            },
            value: 'reponse_1',
            action_id: 'reponse_1_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai appris quelque chose de nouveau ! 📚'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai aidé un collègue ! 🤝'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_action'
          }
        ]
      }
    ],
  },
  {
    question : 'Que pourrais-tu améliorer la semaine prochaine ?',
    blocks : [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Que pourrais-tu améliorer la semaine prochaine ?',
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai terminé un projet ! 🎉'
            },
            value: 'reponse_1',
            action_id: 'reponse_1_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai appris quelque chose de nouveau ! 📚'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai aidé un collègue ! 🤝'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_action'
          }
        ]
      }
    ],
  },
  {
    question : 'De 1 à 5, comment évalues-tu ton énergie cette semaine ?',
    blocks : [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'De 1 à 5, comment évalues-tu ton énergie cette semaine ?',
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai terminé un projet ! 🎉'
            },
            value: 'reponse_1',
            action_id: 'reponse_1_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai appris quelque chose de nouveau ! 📚'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_action'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai aidé un collègue ! 🤝'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_action'
          }
        ]
      }
    ],
  }
];

 const randomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.length);

  return questions[randomIndex];
};

export { randomQuestion };