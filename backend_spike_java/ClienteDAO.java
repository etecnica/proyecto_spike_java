import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public class ClienteDAO {

    public void insertarCliente(Cliente cliente) {
        String sql = "INSERT INTO cliente (nombre, correo, direccionEntrega, password, rol) VALUES (?, ?, ?, ?, ?)";

        try {
            Connection conexion = Conexion.getConexion();
            PreparedStatement ps = conexion.prepareStatement(sql);

            ps.setString(1, cliente.getNombre());
            ps.setString(2, cliente.getCorreo());
            ps.setString(3, cliente.getDireccionEntrega());
            ps.setString(4, cliente.getPassword());
            ps.setString(5, cliente.getRol());

            ps.executeUpdate();

            System.out.println("✅ Cliente insertado correctamente");

        } catch (SQLException e) {
            System.out.println("❌ Error al insertar cliente");
            e.printStackTrace();
        }
    }

    public void consultarClientes() {
        String sql = "SELECT id, nombre, correo, direccionEntrega, rol FROM cliente";

        try {
            Connection conexion = Conexion.getConexion();
            PreparedStatement ps = conexion.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();

            System.out.println("LISTADO DE CLIENTES:");
            System.out.println("--------------------------------");

            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id"));
                System.out.println("Nombre: " + rs.getString("nombre"));
                System.out.println("Correo: " + rs.getString("correo"));
                System.out.println("Dirección: " + rs.getString("direccionEntrega"));
                System.out.println("Rol: " + rs.getString("rol"));
                System.out.println("--------------------------------");
            }

        } catch (SQLException e) {
            System.out.println("❌ Error al consultar clientes");
            e.printStackTrace();
        }
    }

    public void actualizarCliente(int id, String nombre, String correo, String direccionEntrega) {
        String sql = "UPDATE cliente SET nombre = ?, correo = ?, direccionEntrega = ? WHERE id = ?";

        try {
            Connection conexion = Conexion.getConexion();
            PreparedStatement ps = conexion.prepareStatement(sql);

            ps.setString(1, nombre);
            ps.setString(2, correo);
            ps.setString(3, direccionEntrega);
            ps.setInt(4, id);

            ps.executeUpdate();

            System.out.println("✅ Cliente actualizado correctamente");

        } catch (SQLException e) {
            System.out.println("❌ Error al actualizar cliente");
            e.printStackTrace();
        }
    }

    public void eliminarCliente(int id) {
        String sql = "DELETE FROM cliente WHERE id = ?";

        try {
            Connection conexion = Conexion.getConexion();
            PreparedStatement ps = conexion.prepareStatement(sql);

            ps.setInt(1, id);
            ps.executeUpdate();

            System.out.println("✅ Cliente eliminado correctamente");

        } catch (SQLException e) {
            System.out.println("❌ Error al eliminar cliente");
            e.printStackTrace();
        }
    }

    public ArrayList<Cliente> listarClientes() {
    ArrayList<Cliente> lista = new ArrayList<>();
    String sql = "SELECT id, nombre, correo, direccionEntrega, password, rol FROM cliente";

    try {
        Connection conexion = Conexion.getConexion();
        PreparedStatement ps = conexion.prepareStatement(sql);
        ResultSet rs = ps.executeQuery();

        while (rs.next()) {
            Cliente cliente = new Cliente(
                    rs.getInt("id"),
                    rs.getString("nombre"),
                    rs.getString("correo"),
                    rs.getString("direccionEntrega"),
                    rs.getString("password"),
                    rs.getString("rol")
            );

            lista.add(cliente);
        }

    } catch (SQLException e) {
        System.out.println("Error al listar clientes");
        e.printStackTrace();
    }

    return lista;
}
}