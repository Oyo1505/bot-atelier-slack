 const questions = [
  {
    question : 'Comment te sens-tu après cette semaine ? (1 à 5)',
    blocks : [
      {
        type: 'section',
        block_id: 'q_1',
        text: {
          type: 'mrkdwn',
          text: 'Comment à été ta semaine ?'
        }
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '1 : Ça va pas du tout 😔'
            },
            value: 'reponse_1',
            action_id: 'reponse_1_q_1'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '2 : Pas ouf'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_q_1'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '3 : Plutôt bien'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_q_1'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '4 : Bonne semaine.'
            },
            value: 'reponse_4',
            action_id: 'reponse_4_q_1'
          },    {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '5 : Excellente semaine.'
            },
            value: 'reponse_5',
            action_id: 'reponse_5_q_1'
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
        block_id: 'q_2',
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
            action_id: 'reponse_1_q_2'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai appris quelque chose !'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_q_2'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'J’ai aidé un collègue ! 🤝'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_q_2'
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
        block_id: 'q_3',
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
              text: 'Un défi technique 🛠️'
            },
            value: 'reponse_1',
            action_id: 'reponse_1_q_3'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Une gestion de temps ⏳'
            },
            value: 'reponse_2',
            action_id: 'reponse_2_q_3'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Une communication interne 🤝'
            },
            value: 'reponse_3',
            action_id: 'reponse_3_q_3'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Un choix difficile 🤔'
            },
            value: 'reponse_4',
            action_id: 'reponse_4_q_3'
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Un apprentissage 📚'
            },
            value: 'reponse_5',
            action_id: 'reponse_5_q_3'
          }
        ]
      }
    ],
  },
];

 const randomQuestion = () => {
  const randomIndex = Math.floor(Math.random() * questions.length);

  return questions[randomIndex];
};

export { randomQuestion, questions };