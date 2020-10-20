package curologymagicpotionapp

class MagicPotionOrder {

    String firstName
    String lastName
    String email
    String phone
    Integer quantity
    String total
    Date createdDatetime = new Date()
    Boolean fulfilled = false

    static hasOne = [address: Address, payment: Payment]

    static constraints = {
    }
}
