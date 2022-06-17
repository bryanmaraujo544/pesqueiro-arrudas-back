const KitchenOrder = require('../models/KitchenOrder');

class KitchenOrdersRepository {
  async findAll({ made }) {
    const kitchenOrders = await KitchenOrder.find({ isMade: made });
    return kitchenOrders;
  }

  async create({ commandId, table, waiter, products, observation }) {
    const newKitchenOrder = new KitchenOrder({
      commandId,
      table,
      waiter,
      products,
      observation,
    });

    const kitchenOrder = newKitchenOrder.save();
    return kitchenOrder;
  }

  async update({ orderId, isMade, products }) {
    await KitchenOrder.updateOne(
      { _id: orderId },
      {
        $set: {
          isMade,
          products,
        },
      }
    );

    const updatedKitchenOrder = await KitchenOrder.find({ _id: orderId });
    return updatedKitchenOrder;
  }

  async findByCommandId({ commandId }) {
    const kitchenOrder = await KitchenOrder.findOne({ commandId });
    return kitchenOrder;
  }
}

module.exports = new KitchenOrdersRepository();
