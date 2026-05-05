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

        out.println("<h3>Actualizar cliente</h3>");
out.println("<form method='post' action='ClienteServlet'>");
out.println("<input type='hidden' name='accion' value='actualizar'>");
out.println("<input type='hidden' name='vista' value='html'>");

out.println("<label>ID del cliente</label>");
out.println("<input type='text' name='id' required>");

out.println("<label>Nuevo nombre</label>");
out.println("<input type='text' name='nombre' required>");

out.println("<label>Nuevo correo</label>");
out.println("<input type='email' name='correo' required>");

out.println("<label>Nueva dirección</label>");
out.println("<input type='text' name='direccionEntrega' required>");

out.println("<button class='btn' type='submit' style='margin-top:10px;'>Actualizar cliente</button>");
out.println("</form>");

out.println("<hr>");

out.println("<h3>Eliminar cliente</h3>");
out.println("<form method='post' action='ClienteServlet'>");
out.println("<input type='hidden' name='accion' value='eliminar'>");
out.println("<input type='hidden' name='vista' value='html'>");

out.println("<label>ID del cliente a eliminar</label>");
out.println("<input type='text' name='id' required>");

out.println("<button class='btn secondary' type='submit' style='margin-top:10px;'>Eliminar cliente</button>");
out.println("</form>");

out.println("<hr>");

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
    if (accion.equals("login")) {

    String correo = request.getParameter("correo");
    String password = request.getParameter("password");

    Cliente cliente = clienteDAO.validarLogin(correo, password);

    PrintWriter out = response.getWriter();

    if (cliente != null) {
        out.println("{\"id\":" + cliente.getId()
                + ",\"correo\":\"" + cliente.getCorreo()
                + "\",\"nombre\":\"" + cliente.getNombre()
                + "\",\"rol\":\"" + cliente.getRol()
                + "\"}");
    } else {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        out.println("{\"error\":\"Credenciales inválidas\"}");
    }

    return;
}

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

    String vista = request.getParameter("vista");

if ("html".equals(vista)) {
    response.sendRedirect("ClienteServlet");
} else {
    PrintWriter out = response.getWriter();
    out.println("{\"mensaje\":\"Operación realizada correctamente\"}");
}
}
}