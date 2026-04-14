export const config = {
    KAFKA: {
        TOPICS: {
            CARD_REQUESTED: 'io.card.requested.v1',
            CARD_ISSUED: 'io.cards.issued.v1',
            CARD_DLQ: 'io.card.requested.v1.dlq',
        },
        GROUPS:{
            GROUP_ISSUED_CARD: 'issued_cards_group',
            GROUP_ISSUED_CARD_DLQ: 'issued_cards_dlq'
        }
    }
}