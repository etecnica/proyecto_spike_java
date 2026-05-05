import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class Conexion {

    private static final String URL = "jdbc:mysql://localhost:3306/db_spike";
    private static final String USER = "root";
    private static final String PASSWORD = ""; // XAMPP normalmente va sin contraseña

    public static Connection getConexion() {
        Connection conexion = null;

        try {
            System.out.println("Iniciando conexión...");

            Class.forName("com.mysql.cj.jdbc.Driver");
            conexion = DriverManager.getConnection(URL, USER, PASSWORD);

            System.out.println("✅ Conexión exitosa a MySQL");

        } catch (ClassNotFoundException e) {
            System.out.println("❌ No se encontró el driver MySQL");
            e.printStackTrace();

        } catch (SQLException e) {
            System.out.println("❌ Error al conectar con MySQL");
            e.printStackTrace();
        }

        return conexion;
    }
}
