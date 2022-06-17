const CommandsRepository = require('../repositories/CommandsRepository');
const KitchenOrdersRepository = require('../repositories/KitchenOrdersRepository');
const { someIsEmpty } = require('../utils/someIsEmpty');

class KitchenOrderController {
  async index(req, res) {
    const { made } = req.query;
    const kitchenOrders = await KitchenOrdersRepository.findAll({
      made: made === 'true',
    });
    res.send(kitchenOrders);
  }

  async store(req, res) {
    const { commandId, table, waiter, products, observation } = req.body;

    const someFieldIsEmpty = someIsEmpty([table, waiter, commandId]);
    if (someFieldIsEmpty) {
      return res.status(400).json({
        message: 'Campos obrigatórios não foram informados.',
        kitchenOrder: null,
      });
    }

    if (products?.length === 0 || !products) {
      return res.status(400).json({
        message: 'Nenhum produto para ser preparado foi informado',
        kitchenOrder: null,
      });
    }

    const commandOfOrder = await CommandsRepository.findById(commandId);
    if (!commandOfOrder) {
      return res.status(400).json({
        message: 'Não existe nenhum pedido com esta comanda',
        kitchenOrder: null,
      });
    }

    // Grab the orders of this command that already was being sended to kitchen
    const commandKitchenOrder = await KitchenOrdersRepository.findByCommandId({
      commandId,
    });
    const commandProductsSendedToKitchen = commandKitchenOrder?.products;

    // Verify if nothing changed;
    const preparedProductsStr = commandProductsSendedToKitchen
      ?.map(({ name, amount }) => Object.values({ name, amount }).join(''))
      ?.join('');
    const toPrepareProductsStr = products
      .map(({ name, amount }) => Object.values({ name, amount }).join(''))
      .join('');

    if (preparedProductsStr === toPrepareProductsStr) {
      return res.status(400).json({
        message: 'Nenhum produto diferente foi adicionado para ser preparado.',
        kitchenOrder: null,
      });
    }

    const productsToPrepare = products
      .map((product) => {
        const productPrepared = commandProductsSendedToKitchen?.find(
          ({ _id }) => _id === product._id
        );

        // If one same product is sended again to prepare I grabb the difference of amount of old ordering to new one
        // In past 3 Coca was ordered. Then the customer orders more 2. Here the amount of coca will be 5 (total of coca of command);
        // But from this 5 Coca's, 3 already was ordered to kitchen, so in this new order will has only 2 Coca's
        if (productPrepared) {
          const amountToPrepare = product.amount - productPrepared.amount;

          return amountToPrepare === 0
            ? null
            : { ...product, amount: amountToPrepare };
        }

        return product;
      })
      .filter(Boolean);

    const kitchenOrderCreated = await KitchenOrdersRepository.create({
      commandId,
      table,
      waiter,
      products: productsToPrepare,
      observation,
    });

    res.json({
      kitchenOrder: kitchenOrderCreated,
      message: 'Pedido registrado na cozinha',
    });
  }

  async update(req, res) {
    const { id } = req.params;
    const { isMade, products } = req.body;

    if (!id) {
      return res.status(400).json({
        message: 'Id do pedido precisa ser informado',
        kitchenOrder: null,
      });
    }

    const updatedKitchenOrder = await KitchenOrdersRepository.update({
      orderId: id,
      isMade,
      products,
    });
    res.json({
      message: 'Pedido da cozinha atualizado',
      kitchenOrder: updatedKitchenOrder,
    });
  }
}

module.exports = new KitchenOrderController();
