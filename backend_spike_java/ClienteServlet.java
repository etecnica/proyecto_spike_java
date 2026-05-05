import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class ClienteServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("text/html;charset=UTF-8");

        ClienteDAO clienteDAO = new ClienteDAO();
        ArrayList<Cliente> clientes = clienteDAO.listarClientes();

        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html>");
        out.println("<html lang='es'>");
        out.println("<head>");
        out.println("<meta charset='UTF-8'>");
        out.println("<title>Clientes Spike</title>");
        out.println("<link rel='stylesheet' href='styles.css'>");
        out.println("</head>");
        out.println("<body>");
        out.println("<main>");
        out.println("<div class='card'>");
        out.println("<h3>Clientes registrados desde Java Servlet</h3>");

        for (Cliente cliente : clientes) {
            out.println("<p>");
            out.println("<strong>ID:</strong> " + cliente.getId() + "<br>");
            out.println("<strong>Nombre:</strong> " + cliente.getNombre() + "<br>");
            out.println("<strong>Correo:</strong> " + cliente.getCorreo() + "<br>");
            out.println("<strong>Dirección:</strong> " + cliente.getDireccionEntrega() + "<br>");
            out.println("<strong>Rol:</strong> " + cliente.getRol());
            out.println("</p><hr>");
        }

        out.println("</div>");
        out.println("</main>");
        out.println("</body>");
        out.println("</html>");
    }
   @Override
protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

    request.setCharacterEncoding("UTF-8");
    response.setContentType("application/json;charset=UTF-8");

    String accion = request.getParameter("accion");

    if (accion == null) {
        accion = "insertar";
    }

    ClienteDAO clienteDAO = new ClienteDAO();

    if (accion.equals("insertar")) {

        String nombre = request.getParameter("nombre");
        String correo = request.getParameter("correo");
        String direccionEntrega = request.getParameter("direccionEntrega");
        String password = request.getParameter("password");

        Cliente cliente = new Cliente(
                0,
                nombre,
                correo,
                direccionEntrega,
                password,
                "cliente"
        );

        clienteDAO.insertarCliente(cliente);

    } else if (accion.equals("actualizar")) {

        int id = Integer.parseInt(request.getParameter("id"));
        String nombre = request.getParameter("nombre");
        String correo = request.getParameter("correo");
        String direccionEntrega = request.getParameter("direccionEntrega");

        clienteDAO.actualizarCliente(id, nombre, correo, direccionEntrega);

    } else if (accion.equals("eliminar")) {

        int id = Integer.parseInt(request.getParameter("id"));
        clienteDAO.eliminarCliente(id);
    }

    PrintWriter out = response.getWriter();
    out.println("{\"mensaje\":\"Operación realizada correctamente\"}");
}
}