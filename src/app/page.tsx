import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@supabase/supabase-js";
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { redirect } from "next/navigation";

const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET!)

export default async function HomePage() {
  const donations = await supabase
    .from("donaciones")
    .select("*")
    .then(
      ({data}) =>
        data as unknown as Promise<
          {id: number; created_at: number; amount: number; message: string}[]
        >,
    );
  async function donate(formData: FormData) {
    'use server'

    const preference = await new Preference(mercadopago).create({
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

    // console.log(preference)
    // te trae una url a la cual mandar al usuario en dev
    // redirect(preference.sandbox_init_point!)

    // Usar init_point en produccion
    redirect(preference.init_point!)
  }
  return (
    <section className="m-auto grid min-h-screen grid-rows-[auto,1fr,auto] bg-background px-4 font-sans antialiased">
      <main className="py-8">
        <header className="text-center text-xl font-bold leading-[4rem]">Integracion MercadoPago</header>
        <section className="flex flex-col items-center gap-12">
          <form action={donate} className="grid w-full max-w-md gap-6 border p-4">
            <Label className="grid gap-2">
              <span>Valor</span>
              <Input type="number" name="amount" />
            </Label>
            <Label className="grid gap-2">
              <span>Tu mensaje en la donacion</span>
              <Textarea name="message" />
            </Label>
            <Button type="submit">Enviar</Button>
          </form>
          <Table className="w-full" >
            <TableHeader>
              <TableRow>
                <TableHead>Cantidad</TableHead>
                <TableHead className="text-right">Mensaje</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.map((donation) => {
                return (
                  <TableRow key={donation.id}>
                    <TableCell className="font-bold">
                      {donation.amount.toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </TableCell>
                    <TableCell className="text-right">{donation.message}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </section>
      </main>
      <footer className="text-center leading-[4rem] opacity-70">
        © {new Date().getFullYear()} Felipe Leon
      </footer>
    </section>
  );

}