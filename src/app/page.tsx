import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { redirect } from "next/navigation";
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export default function HomePage() {
  async function donate(formData: FormData) {
    'use server'

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: "donacion",
            title: formData.get("message") as string,
            quantity: 1,
            unit_price: Number(formData.get("amount")),
          },
        ],
      },
    });

      // te trae una url a la cual mandar al usuario
      redirect(preference.sandbox_init_point!)
  }
  return (
    <form action={donate} className="m-auto grid max-w-96 gap-6 border p-4">
      <Label className="grid gap-2">
        <span>Valor</span>
        <Input type="number" name="amount"/>
      </Label>
      <Label className="grid gap-2">
        <span>Tu mensaje en la donacion</span>
        <Textarea name="message"/>
      </Label>
      <Button type="submit">Enviar</Button>
    </form>
  );

}