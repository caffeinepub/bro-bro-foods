import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";



actor {
  type PlateType = {
    id : Nat;
    name : Text;
    price : Nat;
  };

  type Order = {
    id : Nat;
    plateTypeId : Nat;
    plateTypeName : Text;
    price : Nat;
    quantity : Nat;
    totalAmount : Nat;
    createdAt : Time.Time;
  };

  var nextOrderId = 0;
  let orders = Map.empty<Nat, Order>();

  func getNextOrderId() : (Nat, Nat) {
    let id = nextOrderId;
    nextOrderId += 1;
    (id, nextOrderId);
  };

  public shared ({ caller }) func createOrder(plateTypeId : Nat, plateTypeName : Text, price : Nat, quantity : Nat) : async Order {
    let (orderId, _) = getNextOrderId();
    let totalAmount = price * quantity;
    let newOrder : Order = {
      id = orderId;
      plateTypeId;
      plateTypeName;
      price;
      quantity;
      totalAmount;
      createdAt = Time.now();
    };
    orders.add(orderId, newOrder);
    newOrder;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    orders.get(orderId);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.toArray().map(
      func((_, order)) { order }
    );
  };
};
