import { redirect } from "next/navigation";

/**
 * La route /contact est remplacée par /mifandraisa (nom malgache).
 * Cette redirection permanente (308) préserve le référencement existant.
 */
export default function ContactRedirect() {
  redirect("/mifandraisa");
}