import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

import Array "mo:core/Array";



actor {
  type PlateType = {
    id : Nat;
    name : Text;
    price : Nat;
  };

  type KxlBankAccount = {
    accountHolder : Text;
    accountNumber : Text;
    ifscCode : Text;
    upiId : Text;
    bankName : Text;
  };

  type PaymentMethod = {
    id : Nat;
    name : Text;
    description : Text;
    kxlBankAccount : ?KxlBankAccount;
    upiId : ?Text;
    qrcodeUrl : ?Text;
  };

  type PaymentConfirmation = {
    utr : Text;
    paidVia : Text;
    paymentMethodId : Nat;
    paidAt : Time.Time;
  };

  // Updated OrderStatus type to include readyToDeliver
  type OrderStatus = {
    #pending;
    #accepted;
    #preparing;
    #readyToDeliver;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  type StatusChangeEvent = {
    status : OrderStatus;
    changedAt : Time.Time;
    changedBy : Text;
  };

  type Order = {
    id : Nat;
    plateTypeId : Nat;
    plateTypeName : Text;
    price : Nat;
    quantity : Nat;
    totalAmount : Nat;
    createdAt : Time.Time;
    paymentMethodId : ?Nat;
    paymentConfirmation : ?PaymentConfirmation;
    status : OrderStatus;
    statusEvents : [StatusChangeEvent];
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
    let initialStatusEvent = {
      status = #pending;
      changedAt = Time.now();
      changedBy = "system";
    };

    let newOrder : Order = {
      id = orderId;
      plateTypeId;
      plateTypeName;
      price;
      quantity;
      totalAmount;
      createdAt = Time.now();
      paymentMethodId = null;
      paymentConfirmation = null;
      status = #pending;
      statusEvents = [initialStatusEvent];
    };
    orders.add(orderId, newOrder);
    newOrder;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    orders.get(orderId);
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };

  public shared ({ caller }) func updatePaymentConfirmation(orderId : Nat, paymentConfirmation : PaymentConfirmation) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?existingOrder) {
        let updatedOrder = {
          existingOrder with paymentConfirmation = ?paymentConfirmation;
        };
        orders.add(orderId, updatedOrder);
        ?updatedOrder;
      };
    };
  };

  public query ({ caller }) func getPaymentConfirmation(orderId : Nat) : async ?PaymentConfirmation {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) { order.paymentConfirmation };
    };
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus, changedBy : Text) : async ?Order {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?existingOrder) {
        let statusEvent = {
          status = newStatus;
          changedAt = Time.now();
          changedBy;
        };

        let updatedOrder = {
          existingOrder with
          status = newStatus;
          statusEvents = existingOrder.statusEvents.concat([statusEvent])
        };
        orders.add(orderId, updatedOrder);
        ?updatedOrder;
      };
    };
  };

  public query ({ caller }) func getOrderStatusTimeline(orderId : Nat) : async ?[StatusChangeEvent] {
    switch (orders.get(orderId)) {
      case (null) { null };
      case (?order) { ?order.statusEvents };
    };
  };
};
