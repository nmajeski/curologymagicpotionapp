package curologymagicpotionapp

class Address {

    String street1
    String street2
    String city
    String state
    String zip

    static belongsTo = [magicPotionOrder: MagicPotionOrder]

    static constraints = {
    }
}
