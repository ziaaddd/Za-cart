import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { supabase } from "../../services/supabase";
import type { TcheckoutForm } from "../../validations/checkout";
import type { Torders } from "../../types/orders";

export interface IorderPayload {
  totalPrice: number;
  discount: number;
  shippingAddress: TcheckoutForm;
}

const actPlacingOrders = createAsyncThunk<
  { completeOrder: Torders },
  IorderPayload
>("orders/actOrders", async (payload: IorderPayload, thunkAPI) => {
  const { rejectWithValue, getState } = thunkAPI;
  const { auth, cart } = getState() as RootState;
  const userId = auth.user?.id;

  if (!userId)
    return rejectWithValue("You must be logged in to place an order.");

  const finalPrice = +(payload.totalPrice - payload.discount).toFixed(2);
  // insert order
  const { data: orderInfo, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_price: finalPrice,
      status: "pending",
      shipping_address: payload.shippingAddress,
    })
    .select()
    .single();

  if (error) return rejectWithValue(error.message);

  const orderItems = cart.ItemsFullInfo.map((product) => ({
    order_id: orderInfo.id,
    product_id: product.id,
    name: product.name,
    image: product.image,
    quantity: cart.items[product.id!] ?? 1,
    price: product.price,
  }));

  //  insert  products of the order
  const { error: itemsError } = await supabase
    .from("orderItems")
    .insert(orderItems)
    .select();

  if (itemsError) return rejectWithValue(itemsError.message);

  // after insert order and its items return (all data in one place) for this current order
  const { data: completeOrder, error: completeOrderError } = await supabase
    .from("orders")
    .select(
      `
      *,
      orderItems (*)
    `,
    )
    .eq("id", orderInfo.id)
    .single();

  if (completeOrderError) return rejectWithValue(completeOrderError.message);

  //clear cart for user after palcing order
  await supabase.from("cart").delete().eq("user_id", userId);

  return { completeOrder };
});

export default actPlacingOrders;
