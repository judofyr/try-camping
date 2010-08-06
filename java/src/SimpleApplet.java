import netscape.javascript.JSObject;

import java.applet.Applet;

import java.security.*;

import org.jruby.embed.ScriptingContainer;
import org.jruby.embed.LocalContextScope;
import org.jruby.embed.LocalVariableBehavior;

public class SimpleApplet extends Applet {
    final ScriptingContainer container[] = {null};
    private JSObject window;
    
    @Override
    public void init() {
        super.init();        
        this.window = JSObject.getWindow(this);
    }
    
    @Override
    public void destroy() {
        super.destroy();
        cleanup();
    }
    
    public void cleanup() {
        if (container[0] != null) {
            evalRuby("TryCamping.cleanup if defined?(TryCamping.cleanup)");
        }
    }
    
    public void newInstance() {
        final SimpleApplet applet = this;
        AccessController.doPrivileged(new PrivilegedAction() {
            public Object run() {
                cleanup();
                container[0] = new ScriptingContainer(LocalContextScope.THREADSAFE, LocalVariableBehavior.TRANSIENT, null);
                container[0].put("JRUBY_APPLET", applet);
                return null;
            }});
        
    }

    public Object evalRuby(final String input) {
        return (Object) AccessController.doPrivileged(new PrivilegedAction() {
            public Object run() {
                    return container[0].runScriptlet(input);
            }});
    }
    
    public JSObject getWindow() {
        return this.window;
    }
}