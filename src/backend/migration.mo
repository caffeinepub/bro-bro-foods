import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type PlateType = {
    id : Nat;
    name : Text;
    price : Nat;
  };

  type OldOrder = {
    id : Nat;
    plateTypeId : Nat;
    plateTypeName : Text;
    price : Nat;
    createdAt : Time.Time;
  };

  type OldActor = {
    nextOrderId : Nat;
    orders : Map.Map<Nat, OldOrder>;
  };

  type NewOrder = {
    id : Nat;
    plateTypeId : Nat;
    plateTypeName : Text;
    price : Nat;
    quantity : Nat;
    totalAmount : Nat;
    createdAt : Time.Time;
  };

  type NewActor = {
    nextOrderId : Nat;
    orders : Map.Map<Nat, NewOrder>;
  };

  public func run(old : OldActor) : NewActor {
    let newOrdersMap = old.orders.map<Nat, OldOrder, NewOrder>(
      func(_orderId, oldOrder) {
        {
          oldOrder with
          quantity = 1;
          totalAmount = oldOrder.price;
        };
      }
    );

    {
      old with
      orders = newOrdersMap;
    };
  };
};
