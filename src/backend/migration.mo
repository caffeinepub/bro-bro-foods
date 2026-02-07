import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type PaymentConfirmation = {
    utr : Text;
    paidVia : Text;
    paymentMethodId : Nat;
    paidAt : Time.Time;
  };

  type OrderStatus = {
    #pending;
    #accepted;
    #preparing;
    #outForDelivery;
    #delivered;
    #cancelled;
  };

  type StatusChangeEvent = {
    status : OrderStatus;
    changedAt : Time.Time;
    changedBy : Text;
  };

  type OldOrder = {
    id : Nat;
    plateTypeId : Nat;
    plateTypeName : Text;
    price : Nat;
    quantity : Nat;
    totalAmount : Nat;
    createdAt : Time.Time;
    paymentMethodId : ?Nat;
    paymentConfirmation : ?PaymentConfirmation;
  };

  type NewOrder = {
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

  type OldActor = {
    nextOrderId : Nat;
    orders : Map.Map<Nat, OldOrder>;
  };

  type NewActor = {
    nextOrderId : Nat;
    orders : Map.Map<Nat, NewOrder>;
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<Nat, OldOrder, NewOrder>(
      func(_id, oldOrder) {
        let initialStatusEvent = {
          status = #pending;
          changedAt = oldOrder.createdAt;
          changedBy = "system";
        };
        {
          oldOrder with
          status = #pending;
          statusEvents = [initialStatusEvent];
        };
      }
    );
    {
      old with
      orders = newOrders;
    };
  };
};
