public class Main {

    public static void main(String[] args) {

        ClienteDAO clienteDAO = new ClienteDAO();

        // 🔹 INSERTAR CLIENTE
        Cliente cliente = new Cliente(
                0,
                "Cliente Prueba Java",
                "clientejava@spike.com",
                "Tunja - Boyacá",
                "12345",
                "cliente"
        );

        clienteDAO.insertarCliente(cliente);

        // 🔹 CONSULTAR CLIENTES
        clienteDAO.consultarClientes();

        // 🔹 ACTUALIZAR CLIENTE
        clienteDAO.actualizarCliente(
                1,
                "Cliente Actualizado Java",
                "actualizado@spike.com",
                "Bogotá - Colombia"
        );

        // 🔹 ELIMINAR CLIENTE (opcional por ahora)
        // clienteDAO.eliminarCliente(1);
    }
}