import { getOrders } from "@/lib/actions/actions";
import { auth } from "@clerk/nextjs";
import Image from "next/image";


const Orders = async () => {
  const { userId } = auth();
  const orders = await getOrders(userId as string);
  orders.sort((a:OrderType, b:OrderType) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="related-products-container px-10 py-5 max-sm:px-3">
      <p className="text-heading3-bold my-10">Your Orders</p>
      {!orders ||
        (orders.length === 0 && (
          <p className="text-body-bold my-5">You have no orders yet.</p>
        ))}

      <div className="flex flex-col gap-10">
        {orders?.map((order: OrderType) => (
          <div className="flex flex-col gap-8 p-4 hover:bg-grey-1" key={order._id}>
            <div className="flex gap-20 max-md:flex-col max-md:gap-3">
              <p className="text-base-bold">Order ID: {order._id}</p>
              <p className="text-base-bold">
                Total Amount: ₹{order.totalAmount}
              </p>
              <p className="text-small-medium">
                Order Date:{" "}
                <span className="text-small-bold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </p>
            </div>

            <p className="text-small-medium mt-3">
              Status:{" "}
              <span className="text-small-bold">
                {order.status || "NOT PAID"} {/* Display status */}
              </span>
            </p>

            {order.status === "Shipped" && order.trackingLink && (
              <div className="mt-3">
                <p className="text-small-medium">
                  Tracking Link:{" "}
                  <a
                    href={order.trackingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {order.trackingLink}
                  </a>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-5 mt-5">
              {order.products.map((orderItem: OrderItemType) => (
                <div className="flex gap-4" key={orderItem._id}>
                  <Image
                    src={orderItem.product.media[0] || "/placeholder.jpg"}
                    alt={orderItem.product.title}
                    width={100}
                    height={100}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-small-medium">
                      Title:{" "}
                      <span className="text-small-bold">
                        {orderItem.product.title}
                      </span>
                    </p>
                    {orderItem.color && (
                      <p className="text-small-medium">
                        Color:{" "}
                        <span className="text-small-bold">{orderItem.color}</span>
                      </p>
                    )}
                    {orderItem.size && (
                      <p className="text-small-medium">
                        Size:{" "}
                        <span className="text-small-bold">{orderItem.size}</span>
                      </p>
                    )}
                    <p className="text-small-medium">
                      Unit price:{" "}
                      <span className="text-small-bold">
                        ₹{orderItem.product.price}
                      </span>
                    </p>
                    <p className="text-small-medium">
                      Quantity:{" "}
                      <span className="text-small-bold">{orderItem.quantity}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
