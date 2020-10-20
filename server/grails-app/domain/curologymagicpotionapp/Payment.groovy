package curologymagicpotionapp

class Payment {

    String ccNum
    String exp

    static belongsTo = [magicPotionOrder: MagicPotionOrder]

    static constraints = {
    }
}
