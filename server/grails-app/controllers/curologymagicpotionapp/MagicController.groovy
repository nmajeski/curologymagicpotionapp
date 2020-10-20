package curologymagicpotionapp


import grails.rest.*
import grails.converters.*

class MagicController {
	static responseFormats = ['json', 'xml']
	
    def index() { }

    def create() {
        try {
            Map json
        
            try {
                json = request.JSON as Map
            } catch(ignore) {}

            if (!json) {
                render status: 400, text: 'Bad JSON format.'
                return
            }

            List<String> errorFields = []
            String firstName = json.firstName
            if (!firstName) errorFields.add('firstName')
            String lastName = json.lastName
            if (!lastName) errorFields.add('lastName')
            String email = json.email
            if (!email) errorFields.add('email')
            String addressLine1 = json.address?.street1
            if (!addressLine1) errorFields.add('address.street1')
            String addressLine2 = json.address?.street2
            if (!addressLine2) errorFields.add('address.street2')
            String city = json.address?.city
            if (!city) errorFields.add('address.city')
            String state = json.address?.state
            if (!state) errorFields.add('address.state')
            String zip = json.address?.zip
            if (!zip) errorFields.add('address.zip')
            String phone = json.phone
            if (!phone) errorFields.add('phone')
            Integer quantity
            try {
                quantity = json.quantity
            } catch(ignore) {}
            if (!quantity || quantity > 3 || quantity < 1) errorFields.add('quantity')
            String total = json.total
            if (!total) errorFields.add('total')
            String ccNum = json.payment?.ccNum
            if (!ccNum) errorFields.add('payment.ccNum')
            String exp = json.payment?.exp
            if (!exp) errorFields.add('payment.exp')

            if (errorFields) {
                String errorText = "Please validate the following required fields:\n"
                errorFields.each { String errorField ->
                    errorText += "$errorField\n"
                }
                render status: 400, text: errorText
                return
            }

            Calendar cal = Calendar.getInstance();
            cal.set(Calendar.DAY_OF_MONTH, 1);
            Date beginningOfMonth = cal.getTime().clearTime();

            List<MagicPotionOrder> existingOrders = MagicPotionOrder.findAllByFirstNameAndLastNameAndEmailAndCreatedDatetimeBetween(firstName, lastName, email, beginningOfMonth, new Date())

            if (existingOrders) {
                Integer totalQuantity = quantity
                existingOrders.each {
                    totalQuantity += it.quantity
                }
                if (totalQuantity > 3) {
                    render status: 403, text: 'Cannot place orders for more than 3 Magic Potions per month. Please try again next month.'
                    return
                }
            }

            MagicPotionOrder order = new MagicPotionOrder(
                firstName: firstName,
                lastName: lastName,
                email: email,
                address: new Address(
                    street1: addressLine1,
                    street2: addressLine2,
                    city: city,
                    state: state,
                    zip: zip
                ),
                phone: phone,
                quantity: quantity,
                total: total,
                payment: new Payment(
                    ccNum: ccNum,
                    exp: exp
                )
            ).save(failOnError: true)

            response.status = 201
            render([id: order.id] as JSON)
        } catch (Exception e) {
            log.error("Exception occurred: ${e.printStackTrace()}")
            render status: 500, text: 'Internal Server Error occurred'
        }
    }

    def retrieve() {
        Long id = params.long('id')

        if (!id || id <= 0) {
            render status: 400, text: "Provided ID parameter is invalid"
            return
        }

        MagicPotionOrder order = MagicPotionOrder.get(id)
        if (!order) {
            render status: 404, text: "resource not found"
            return
        }

        Map orderJsonMap = [
            firstName: order.firstName,
            lastName: order.lastName,
            email: order.email,
            address: [
                street1: order.address.street1,
                street2: order.address.street2,
                city: order.address.city,
                state: order.address.state,
                zip: order.address.zip
            ],
            phone: order.phone,
            payment: [
                ccNum: order.payment.ccNum,
                exp: order.payment.exp
            ],
            quantity: order.quantity,
            total: order.total,
            orderDate: order.createdDatetime,
            fulfilled: order.fulfilled
        ]

        render(orderJsonMap as JSON)
    }

    def patch() {
        Map json
        
        try {
            json = request.JSON as Map
        } catch(ignore) {}

        if (!json) {
            render status: 400, text: 'Bad JSON format.'
            return
        }

        Long id
        Boolean fulfilled
        try {
            id = json.id
            fulfilled = json.fulfilled
        } catch(ignore) {}

        if (!id || id <= 0 || fulfilled == null) {
            render status: 400, text: 'Invalid JSON body. Please double check that `id` and `fulfilled` are being provided and are valid, and then try again.'
            return
        }

        MagicPotionOrder order = MagicPotionOrder.get(id)
        if (!order) {
            render status: 404, text: "resource not found"
            return
        }

        order.fulfilled = fulfilled
        order.save(failOnError: true, flush: true)

        render status: 200, text: "resource updated successfully"
    }

    def delete() {
        Long id = params.long('id')

        if (!id || id <= 0) {
            render status: 400, text: "Provided ID parameter is invalid"
            return
        }

        MagicPotionOrder order = MagicPotionOrder.get(id)
        if (!order) {
            render status: 404, text: "resource not found"
            return
        }

        order.delete(flush: true)

        render status: 200, text: "resource deleted successfully"
    }
}
