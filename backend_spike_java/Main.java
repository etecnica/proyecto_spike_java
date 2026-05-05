import java.sql.Connection;

public class Main {

    public static void main(String[] args) {

        Connection conexion = Conexion.getConexion();

        if (conexion != null) {
            System.out.println("🎉 Todo funciona correctamente");
        } else {
            System.out.println("⚠️ No se pudo conectar");
        }
    }
}