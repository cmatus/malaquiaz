using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;

namespace ws.impresion
{
    
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    [System.Web.Script.Services.ScriptService]
    public class wsImprime : System.Web.Services.WebService
    {

        [WebMethod]
        public bool imprimir(List<string> texto, Boolean corte, Boolean apertura, string tipo)
        {
            try
            {
                clsImpresion tmpImpresion = new clsImpresion();
                switch (tipo)
                {
                    case "usb":
                        tmpImpresion.ImpresionUSB(texto, corte, apertura);
                        break;
                    case "tcp":
                        tmpImpresion.ImpresionTCP(texto, corte, apertura);
                        break;
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        [WebMethod]
        public bool test()
        {
            try
            {
                //clsImpresion.test();
                return true;
            }
            catch
            {
                return false;
            }
        }

    }
}
